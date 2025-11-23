FROM nginx:1.27-alpine

# copy cấu hình
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

# tuỳ chọn: copy luôn static build nếu bạn build sẵn ngoài container
# COPY ../../frontend/build /usr/share/nginx/html
# hoặc trong compose bạn mount volume build vào /usr/share/nginx/html

EXPOSE 80
