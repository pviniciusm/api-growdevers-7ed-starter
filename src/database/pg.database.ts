import { Pool } from "pg";

export const dbConnection = new Pool({
    // Opção 1
    connectionString:
        "postgres://teste_py6o_user:kQiYH03fjw1FJpUuyuRKsu6Ha2Mzih1G@dpg-cdauhnaen0hldb3jobgg-a.frankfurt-postgres.render.com/teste_py6o",

    // Opção 2
    // host: "dpg-cdauhnaen0hldb3jobgg-a.frankfurt-postgres.render.com",
    // user: "teste_py6o_user",
    // password: "kQiYH03fjw1FJpUuyuRKsu6Ha2Mzih1G",
    // database: "teste_py6o",

    ssl: {
        rejectUnauthorized: false,
    },
});
