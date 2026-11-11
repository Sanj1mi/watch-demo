package com.unik.watchdemo2.controller;

import com.unik.watchdemo2.model.dto.ApiResp;
import com.unik.watchdemo2.model.dto.AuthReq;
import com.unik.watchdemo2.service.intr.AdminService;
import com.unik.watchdemo2.service.intr.HospService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;
    private final HospService hospService;

    /** admin auth */
    @PostMapping("/auth")
    public ResponseEntity<ApiResp> authenticate(@RequestBody AuthReq request) {
        log.info("Admin authentication attempt");
        try {
            boolean authenticated = adminService.auth(request.getPassword());
            if (authenticated) {
                return ResponseEntity.ok(
                        new ApiResp("Аутентификация успешна", null)
                );
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                        new ApiResp("Неверный пароль", null)
                );
            }
        } catch (Exception e) {
            log.error("Error during authentication", e);
            return ResponseEntity.badRequest().body(
                    new ApiResp("Ошибка аутентификации: " + e.getMessage(), null)
            );
        }
    }
    /** delete note */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResp> deleteRecord(@PathVariable UUID id) {
        log.info("Admin delete request for ID: {}", id);
        try {
            if (!adminService.hasAccess()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                        new ApiResp("Требуется аутентификация администратора", null)
                );
            }

            boolean deleted = hospService.delete(id);
            if (deleted) {
                return ResponseEntity.ok(
                        new ApiResp("Запись удалена успешно", null)
                );
            } else {
                return ResponseEntity.badRequest().body(
                        new ApiResp("Запись не найдена", null)
                );
            }
        } catch (Exception e) {
            log.error("Error deleting record", e);
            return ResponseEntity.badRequest().body(
                    new ApiResp("Ошибка удаления: " + e.getMessage(), null)
            );
        }
    }

    /** admin status statement */
    @GetMapping("/status")
    public ResponseEntity<ApiResp> checkAdminStatus() {
        log.info("Checking admin status");
        try {
            boolean isAdmin = adminService.isAdminMode();
            Map<String, Boolean> status = new HashMap<>();
            status.put("isAdmin", isAdmin);
            return ResponseEntity.ok(
                    new ApiResp("Статус получен успешно", status)
            );
        } catch (Exception e) {
            log.error("Error checking admin status", e);
            return ResponseEntity.badRequest().body(
                    new ApiResp("Ошибка проверки статуса: " + e.getMessage(), null)
            );
        }
    }

    /** logout */
    @PostMapping("/logout")
    public ResponseEntity<ApiResp> logout() {
        log.info("Admin logout request");
        try {
            adminService.logout();
            return ResponseEntity.ok(
                    new ApiResp("Выход из админ-режима выполнен успешно", null)
            );
        } catch (Exception e) {
            log.error("Error logging out", e);
            return ResponseEntity.badRequest().body(
                    new ApiResp("Ошибка выхода: " + e.getMessage(), null)
            );
        }
    }

    /** delete all (ONLY EXTREME MEASURE)*/
    @DeleteMapping("/clear")
    public ResponseEntity<ApiResp> clearAll() {
        log.info("Admin clear all request");
        try {
            if (!adminService.hasAccess()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                        new ApiResp("Требуется аутентификация администратора", null)
                );
            }

            /** get all and delete step-by-step */
            var all = hospService.getAll();
            int deletedCount = 0;

            for (var person : all) {
                if (hospService.delete(person.getId())) {
                    deletedCount++;
                }
            }

            return ResponseEntity.ok(
                    new ApiResp("База данных очищена. Удалено записей: " + deletedCount, null)
            );
        } catch (Exception e) {
            log.error("Error clearing all", e);
            return ResponseEntity.badRequest().body(
                    new ApiResp("Ошибка очистки базы: " + e.getMessage(), null)
            );
        }
    }
}
