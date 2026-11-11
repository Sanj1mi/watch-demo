package com.unik.watchdemo2;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
public class WatchDemo2Application {
    public static void main(String[] args) {
        log.info("current path http://localhost:1488/");
        SpringApplication.run(WatchDemo2Application.class, args);
    }

}
