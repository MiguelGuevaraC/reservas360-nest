import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { QueryConfig } from "./types";
import { UserResponseDTO } from '../auth/dto/user-response.dto';
import { plainToInstance } from "class-transformer";

@Injectable()
export class DynamicQueryService {
  constructor(private readonly dataSource: DataSource) {}

  async findAllWithConfig<T>(
    entity: { new (): T },
    alias: string,
  dtoClass: new (entity: T) => any, // Recibimos la clase DTO para mapear
    config: QueryConfig,
    queryParams: any = {}, // Asegurar que queryParams no sea undefined
    baseUrl: string = "" // Recibir la URL base para construir links
  ) {
    const qb = this.dataSource.getRepository(entity).createQueryBuilder(alias);

    let { page, limit, orderBy, orderDir, start, end, ...filters } =
      queryParams;
    page = page || 1;
    limit = limit || 15;
    orderDir = orderDir || "desc";

    // Filtros dinámicos
    Object.entries(config.filters).forEach(([field, operator]) => {
      const paramName = `${field}_param`;
      if (operator === "date" && start && end) {
        qb.andWhere(`${alias}.${field} BETWEEN :start AND :end`, {
          start,
          end,
        });
      }
      const value = filters[field];
      if (value === undefined) return;
      // Aquí tu switch para operadores
      switch (operator) {
        case "=":
        case "!=":
        case ">":
        case ">=":
        case "<":
        case "<=":
          qb.andWhere(`${alias}.${field} ${operator} :${paramName}`, {
            [paramName]: value,
          });
          break;
        case "like":
          qb.andWhere(`${alias}.${field} LIKE :${paramName}`, {
            [paramName]: `%${value}%`,
          });
          break;
        case "in":
          const values = Array.isArray(value)
            ? value
            : String(value).split(",");
          qb.andWhere(`${alias}.${field} IN (:...${paramName})`, {
            [paramName]: values,
          });
          break;
        case "between":
          const [min, max] = String(value).split(",");
          if (min && max) {
            qb.andWhere(`${alias}.${field} BETWEEN :min AND :max`, {
              min,
              max,
            });
          }
          break;
      }
    });

    // Orden y paginación
    const orderField = config.orderableFields.includes(orderBy)
      ? orderBy
      : config.orderableFields[0];
    qb.orderBy(
      `${alias}.${orderField}`,
      orderDir.toUpperCase() === "DESC" ? "DESC" : "ASC"
    );

    const skip = (+page - 1) * +limit;
    qb.skip(skip).take(+limit);

    const [data, total] = await qb.getManyAndCount();
    const lastPage = Math.ceil(total / limit);

const dataDto = plainToInstance(dtoClass, data, { excludeExtraneousValues: true });

    // Construir links para paginación con baseUrl y queryParams
    // baseUrl debería ser la URL base sin query params (ej: https://mi-api.com/users)
    const makePageLink = (pageNum: number | null) => {
      if (pageNum === null || pageNum < 1 || pageNum > lastPage) return null;
      const query = new URLSearchParams({
        ...filters,
        page: String(pageNum),
        limit: String(limit),
      });
      if (orderBy) query.set("orderBy", orderBy);
      if (orderDir) query.set("orderDir", orderDir);
      if (start) query.set("start", start);
      if (end) query.set("end", end);
      return `${baseUrl}?${query.toString()}`;
    };

    const links = {
      first: makePageLink(1),
      last: makePageLink(lastPage),
      prev: page > 1 ? makePageLink(page - 1) : null,
      next: page < lastPage ? makePageLink(page + 1) : null,
    };

    return {
      data:dataDto,
      meta: {
        total,
        page: +page,
        limit: +limit,
        pages: lastPage,
      },
    };
  }
}
