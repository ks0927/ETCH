package com.ssafy.etch;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

//@SpringBootApplication
@SpringBootApplication(scanBasePackages = "com.ssafy.etch")
public class EtchApplication {

    public static void main(String[] args) {
        SpringApplication.run(EtchApplication.class, args);
    }

}
