You need to download JDK and Maven to compile and run this project

```sh
mvn dependency:copy-dependencies compile
java -cp 'target/classes:target/dependency/*' examples.hello
java -cp 'target/classes:target/dependency/*' examples.test
```
