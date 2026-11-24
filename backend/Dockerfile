FROM php:8.5-cli-alpine AS vendor

RUN apk add --no-cache curl \
    && curl -fsSL https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions \
        -o /usr/local/bin/install-php-extensions \
    && chmod +x /usr/local/bin/install-php-extensions \
    && install-php-extensions intl pdo_pgsql zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock symfony.lock ./

RUN composer install --no-dev --no-scripts --prefer-dist --no-interaction --no-progress \
        --ignore-platform-req=ext-amqp

COPY . .

RUN composer dump-autoload --optimize --classmap-authoritative --no-dev


FROM php:8.5-fpm-alpine AS runtime

RUN apk add --no-cache su-exec curl \
    && curl -fsSL https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions \
        -o /usr/local/bin/install-php-extensions \
    && chmod +x /usr/local/bin/install-php-extensions \
    && install-php-extensions intl pdo_pgsql zip opcache

RUN set -eu; \
    ok=0; \
    for i in 1 2 3; do \
        if install-php-extensions amqp; then ok=1; break; fi; \
        echo "amqp install attempt $i failed, retrying..."; \
        sleep 10; \
    done; \
    [ "$ok" = "1" ]; \
    rm -rf /var/cache/apk/*

WORKDIR /var/www/html

COPY --from=vendor --chown=www-data:www-data /var/www/html /var/www/html

RUN printf 'APP_ENV=prod\nAPP_DEBUG=0\n' > .env

RUN cat > /usr/local/bin/entrypoint.sh <<'EOF'
#!/bin/sh
set -e

mkdir -p var/cache var/log var/share
chown -R www-data:www-data var

echo "Waiting for database..."
until php -r 'try { new PDO("pgsql:host=".getenv("POSTGRES_URL").";port=".getenv("POSTGRES_PORT").";dbname=".getenv("POSTGRES_DB"), getenv("POSTGRES_USERNAME"), getenv("POSTGRES_PASSWORD")); exit(0); } catch (Throwable $e) { exit(1); }'; do
    sleep 2
done

if [ ! -f config/jwt/private.pem ] || [ ! -f config/jwt/public.pem ]; then
    echo "Generating JWT keypair..."
    su-exec www-data php bin/console lexik:jwt:generate-keypair --overwrite --no-interaction
fi

su-exec www-data php bin/console cache:clear --no-warmup
su-exec www-data php bin/console cache:warmup
su-exec www-data php bin/console assets:install public --no-interaction
su-exec www-data php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration

exec php-fpm -F
EOF

RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
