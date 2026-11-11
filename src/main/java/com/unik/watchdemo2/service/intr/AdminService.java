package com.unik.watchdemo2.service.intr;

public interface AdminService {
    boolean auth(String password);
    boolean hasAccess();
    void logout();
    boolean isAdminMode();
}
