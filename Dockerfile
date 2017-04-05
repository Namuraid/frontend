from node

ENV APP_HOME /app
workdir $APP_HOME

add package.json $APP_HOME
add yarn.lock $APP_HOME
run yarn install
run yarn global add @angular/cli

add . $APP_HOME
