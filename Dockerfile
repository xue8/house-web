#ָ��node�ľ���Դ
FROM node:slim

MAINTAINER xue8 <rongyuexue@gmail.com>
#��װ�Ա������cnpm
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
#��װvue-cli
RUN cnpm install -g vue-cli 
 
RUN mkdir /code
COPY . /code
 
WORKDIR /code
#���⿪��8080�˿�
EXPOSE 8080