import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { PurchaseModule } from './purchase/purchase.module';
import { CategoryModule } from './category/category.module';
import { PurchaseProductModule } from './purchase-product/purchase-product.module';
import { ImageModule } from './image/image.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [UsersModule, ProductsModule, PurchaseModule, CategoryModule, PurchaseProductModule, ImageModule, RoleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
