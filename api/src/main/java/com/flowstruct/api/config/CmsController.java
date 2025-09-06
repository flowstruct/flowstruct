package com.flowstruct.api.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/cms")
public class CmsController {

    @GetMapping("/**")
    public String forwardCmsRoutes() {
        return "forward:/index.html";
    }
}