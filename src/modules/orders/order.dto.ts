import { Exclude, Type } from "class-transformer";
import { IsUUID, IsOptional, IsString, IsNumber, Min, Max, IsPositive, IsArray, ArrayMinSize, ValidateNested, ArrayUnique, IsEnum } from "class-validator";
import { PRODUCT_DUPLICATED } from "../common/constants/error-messages.constants";
import { OrderStatus } from "./entities/order.entity";

export class CreateOrderItemDto {
    @IsUUID()
    productId: string;

    @IsNumber()
    @IsPositive()
    quantity: number;
}

export class CreateOrderDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @Exclude()
    userId: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    @ArrayUnique((item: CreateOrderItemDto) => item.productId, { message: PRODUCT_DUPLICATED })
    items: CreateOrderItemDto[];
}

export class GetOrdersFilterQueryDto {
    @IsOptional()
    @IsString()
    @IsEnum(OrderStatus)
    status?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    page?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit?: number;
}

export class UpdateOrderStatusDto {
    @IsEnum(OrderStatus)
    status: string;
}