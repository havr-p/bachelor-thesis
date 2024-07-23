FROM eclipse-temurin:21 as build
WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# For windows problem :: ./mvnw not found
RUN apt-get update && apt-get install dos2unix -y && dos2unix mvnw && chmod +x mvnw

RUN ./mvnw install -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

#RUN mkdir -p src/main/resources/static
#RUN ls -l
#COPY  src/main/resources/static/tt-requirements.json src/main/resources/static/
#COPY src/main/resources/static/tt-relationships.json src/main/resources/static/
#RUN ls -l
COPY src/main/resources /app/

FROM eclipse-temurin:21
VOLUME /tmp
ARG DEPENDENCY=/workspace/app/target/dependency
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app
ENTRYPOINT ["java", "--enable-preview", "-cp","app:app/lib/*","uniba.fmph.traceability_tutor.TraceabilityTutorApplication"]
