import * as Joi from 'joi';

export const validationSchema = Joi.object({
  POSTGRES_PASSWORD: Joi.string()
    .description('Password for the postgres database')
    .required(),
  POSTGRES_DATABASE: Joi.string()
    .description('Database name for the postgres database')
    .required(),
  POSTGRES_USER: Joi.string()
    .description('Username for the postgres database')
    .required(),
  POSTGRES_PORT: Joi.number()
    .description('Port for the postgres database')
    .required(),
  POSTGRES_HOST: Joi.string()
    .description('Username for the postgres database')
    .required(),
});
