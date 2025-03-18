import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { SeedService } from "./seed.service";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Seed")
@Controller("seed")
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
    @ApiBearerAuth() // Requiere un Bearer Token para la autenticación

  // @Auth( ValidRoles.admin )
  executeSeed() {
    return this.seedService.runSeed();
  }
}
