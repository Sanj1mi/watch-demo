package com.unik.watchdemo2.service.impl;

import com.unik.watchdemo2.service.intr.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AdminServiceImpl implements AdminService {
    @Value("${admin.password:admin123}")
    private String adminPassword;

    private boolean isAuthenticated = false;

    @Override
    public boolean auth(String password) {
        isAuthenticated = adminPassword.equals(password);

        if (isAuthenticated) {
            log.info("Admin authentication successful");
        } else {
            log.warn("Failed admin authentication attempt");
        }

        return isAuthenticated;
    }

    @Override
    public boolean hasAccess() {
        return isAuthenticated;
    }

    @Override
    public void logout() {
        if (isAuthenticated) {
            log.info("Admin logged out");
        }
        isAuthenticated = false;
    }

    @Override
    public boolean isAdminMode() {
        return isAuthenticated;
    }
}