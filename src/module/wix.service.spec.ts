import { Test, TestingModule } from "@nestjs/testing";
import { WixService } from "./wix.service";

describe("WixService", () => {
  let service: WixService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WixService],
    }).compile();

    service = module.get<WixService>(WixService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
