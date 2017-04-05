from node

run yarn global add @angular/cli

ENV APP_HOME /app
workdir $APP_HOME

add package.json $APP_HOME
add yarn.lock $APP_HOME
run yarn install

add . $APP_HOME
