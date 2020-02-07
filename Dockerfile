#指定node的镜像源
FROM node:slim

MAINTAINER xue8 <rongyuexue@gmail.com>
#安装淘宝镜像的cnpm
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
#安装vue-cli
RUN cnpm install -g vue-cli 
 
RUN mkdir /code
COPY . /code
 
WORKDIR /code
#对外开放8080端口
EXPOSE 8080