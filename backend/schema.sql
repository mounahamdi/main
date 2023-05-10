-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema rbkecomdb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema rbkecomdb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `rbkecomdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `rbkecomdb` ;

-- -----------------------------------------------------
-- Table `rbkecomdb`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rbkecomdb`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NULL DEFAULT '',
  `address` VARCHAR(255) NOT NULL DEFAULT '',
  `city` VARCHAR(255) NOT NULL DEFAULT '',
  `state` VARCHAR(255) NOT NULL DEFAULT '',
  `zip_code` VARCHAR(10) NOT NULL DEFAULT '',
  `country` VARCHAR(255) NOT NULL DEFAULT '',
  `role` ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
  `is_banned` TINYINT(1) NOT NULL DEFAULT '0',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `rbkecomdb`.`products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rbkecomdb`.`products` (
  `product_id` INT NOT NULL AUTO_INCREMENT,
  `product_name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `image` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`product_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `rbkecomdb`.`cart_items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rbkecomdb`.`cart_items` (
  `cart_item_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL DEFAULT NULL,
  `product_id` INT NULL DEFAULT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `added_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_item_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `product_id` (`product_id` ASC) VISIBLE,
  CONSTRAINT `cart_items_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `rbkecomdb`.`users` (`user_id`),
  CONSTRAINT `cart_items_ibfk_2`
    FOREIGN KEY (`product_id`)
    REFERENCES `rbkecomdb`.`products` (`product_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `rbkecomdb`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rbkecomdb`.`categories` (
  `category_id` INT NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `rbkecomdb`.`orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rbkecomdb`.`orders` (
  `order_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL DEFAULT NULL,
  `order_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `status` VARCHAR(20) NOT NULL,
  `shipping_address` VARCHAR(255) NOT NULL,
  `shipping_city` VARCHAR(255) NOT NULL,
  `shipping_state` VARCHAR(255) NOT NULL,
  `shipping_zip_code` VARCHAR(10) NOT NULL,
  `shipping_country` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `orders_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `rbkecomdb`.`users` (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `rbkecomdb`.`order_items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rbkecomdb`.`order_items` (
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `order_items_status` VARCHAR(255) NULL DEFAULT 'pending',
  PRIMARY KEY (`order_id`, `product_id`),
  INDEX `product_id` (`product_id` ASC) VISIBLE,
  CONSTRAINT `order_items_ibfk_1`
    FOREIGN KEY (`order_id`)
    REFERENCES `rbkecomdb`.`orders` (`order_id`)
    ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2`
    FOREIGN KEY (`product_id`)
    REFERENCES `rbkecomdb`.`products` (`product_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `rbkecomdb`.`payments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rbkecomdb`.`payments` (
  `payment_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL DEFAULT NULL,
  `order_id` INT NULL DEFAULT NULL,
  `payment_method` VARCHAR(255) NOT NULL,
  `payment_amount` DECIMAL(10,2) NOT NULL,
  `payment_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`payment_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `order_id` (`order_id` ASC) VISIBLE,
  CONSTRAINT `payments_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `rbkecomdb`.`users` (`user_id`),
  CONSTRAINT `payments_ibfk_2`
    FOREIGN KEY (`order_id`)
    REFERENCES `rbkecomdb`.`orders` (`order_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `rbkecomdb`.`products_categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rbkecomdb`.`products_categories` (
  `product_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`product_id`, `category_id`),
  INDEX `category_id` (`category_id` ASC) VISIBLE,
  CONSTRAINT `products_categories_ibfk_1`
    FOREIGN KEY (`product_id`)
    REFERENCES `rbkecomdb`.`products` (`product_id`)
    ON DELETE CASCADE,
  CONSTRAINT `products_categories_ibfk_2`
    FOREIGN KEY (`category_id`)
    REFERENCES `rbkecomdb`.`categories` (`category_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `rbkecomdb`.`promotions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rbkecomdb`.`promotions` (
  `promotion_id` INT NOT NULL AUTO_INCREMENT,
  `promotion_name` VARCHAR(255) NOT NULL,
  `discount` DECIMAL(5,2) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` TINYINT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`promotion_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `rbkecomdb`.`promotion_products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rbkecomdb`.`promotion_products` (
  `promotion_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  PRIMARY KEY (`promotion_id`, `product_id`),
  INDEX `product_id` (`product_id` ASC) VISIBLE,
  CONSTRAINT `promotion_products_ibfk_1`
    FOREIGN KEY (`promotion_id`)
    REFERENCES `rbkecomdb`.`promotions` (`promotion_id`)
    ON DELETE CASCADE,
  CONSTRAINT `promotion_products_ibfk_2`
    FOREIGN KEY (`product_id`)
    REFERENCES `rbkecomdb`.`products` (`product_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `rbkecomdb`.`reviews`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rbkecomdb`.`reviews` (
  `review_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL DEFAULT NULL,
  `product_id` INT NULL DEFAULT NULL,
  `rating` INT NOT NULL,
  `review_text` TEXT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `product_id` (`product_id` ASC) VISIBLE,
  CONSTRAINT `reviews_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `rbkecomdb`.`users` (`user_id`),
  CONSTRAINT `reviews_ibfk_2`
    FOREIGN KEY (`product_id`)
    REFERENCES `rbkecomdb`.`products` (`product_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `rbkecomdb`.`wishlists`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rbkecomdb`.`wishlists` (
  `wishlist_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL DEFAULT NULL,
  `product_id` INT NULL DEFAULT NULL,
  `added_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`wishlist_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `product_id` (`product_id` ASC) VISIBLE,
  CONSTRAINT `wishlists_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `rbkecomdb`.`users` (`user_id`),
  CONSTRAINT `wishlists_ibfk_2`
    FOREIGN KEY (`product_id`)
    REFERENCES `rbkecomdb`.`products` (`product_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
