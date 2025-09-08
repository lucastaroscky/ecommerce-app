import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

export function validateDto<T extends object>(
    dtoClass: new () => T,
    data: any
): { isValid: boolean; errors?: string[]; dto?: T } {
    const dto = plainToInstance(dtoClass, data);
    const errors = validateSync(dto);

    if (errors.length > 0) {
        return {
            isValid: false,
            errors: errors.map(err => Object.values(err.constraints || {}).join(', ')),
        };
    }

    return { isValid: true, dto };
}