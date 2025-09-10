export enum SortOptions {
    name_asc = "name_asc",
    name_desc = "name_desc",
    price_asc = "price_asc",
    price_desc = "price_desc",
    created_asc = "created_asc",
    created_desc = "created_desc",
}

export const FilterLabels: Record<SortOptions, string> = {
    [SortOptions.name_asc]: "Nome A-Z",
    [SortOptions.name_desc]: "Nome Z-A",
    [SortOptions.price_asc]: "Preço Crescente",
    [SortOptions.price_desc]: "Preço Decrescente",
    [SortOptions.created_asc]: "Mais antigos",
    [SortOptions.created_desc]: "Mais novos",
};