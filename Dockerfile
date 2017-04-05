FROM node

ENV APP_HOME /app
WORKDIR $APP_HOME

ADD package.json $APP_HOME
ADD yarn.lock $APP_HOME
RUN yarn install
RUN yarn global add @angular/cli

ADD . $APP_HOME
