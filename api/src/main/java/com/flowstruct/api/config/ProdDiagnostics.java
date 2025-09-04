package com.flowstruct.api.config;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("prod")
public class ProdDiagnostics {

    @PostConstruct
    public void check() {
        System.out.println("prod profile is active.");
    }
}
