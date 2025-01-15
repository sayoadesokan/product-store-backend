import { IsString, IsNotEmpty, IsNumber, IsInt } from 'class-validator';

export class ProductDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsNumber({}, { message: 'Price must be a valid number' })
  price!: number;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsNumber({}, { message: 'Stock must be a valid number' })
  stock!: number;
}
