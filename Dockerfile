from node

run yarn global add @angular/cli

ENV APP_HOME /app
RUN mkdir -p $APP_HOME

workdir $APP_HOME

add package.json $APP_HOME
add yarn.lock $APP_HOME
run yarn install

add . $APP_HOME

expose 4200
