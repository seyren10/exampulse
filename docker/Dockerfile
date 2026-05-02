FROM php:8.3-fpm

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create user matching WSL uid to avoid permission issues
RUN groupadd -g 1000 exampulse && \
    useradd -u 1000 -g exampulse -m -s /bin/bash exampulse

# Set user
USER exampulse

# Expose port 9000 for PHP-FPM
EXPOSE 9000

CMD ["php-fpm"]
