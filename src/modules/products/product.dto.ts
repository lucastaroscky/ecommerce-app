import { IsOptional, IsString, IsInt, Min, IsNumber, Matches, IsUUID } from "class-validator";
import { Exclude, Type } from "class-transformer";

export class ProductQueryDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    sort?: string = "created_at";

    @IsOptional()
    @IsString()
    order?: "ASC" | "DESC" = "ASC";
}

export class CreateProductBodyDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price: number;

    @IsOptional()
    @IsString()
    photo: string;

    @IsInt()
    @Min(0)
    stockQuantity: number;

    @Exclude()
    createdById: string;
}


export class UpdateProductBodyDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @IsOptional()
    price: number;

    @IsOptional()
    @IsString()
    @IsOptional()
    photo: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    stockQuantity: number;
}

export class ProductParamsDto {
    @IsString()
    @IsUUID('4')
    id: string;
}
