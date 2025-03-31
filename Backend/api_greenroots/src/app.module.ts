import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { PurchaseModule } from './purchase/purchase.module';
import { CategoryModule } from './category/category.module';
import { PurchaseProductModule } from './purchase-product/purchase-product.module';
import { ImageModule } from './image/image.module';
import { RoleModule } from './role/role.module';
import { PrismaService } from 'prisma/prisma.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    PurchaseModule,
    CategoryModule,
    PurchaseProductModule,
    ImageModule,
    RoleModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
