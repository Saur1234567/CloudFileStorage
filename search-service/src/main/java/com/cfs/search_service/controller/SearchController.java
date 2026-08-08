package com.cfs.search_service.controller;

import com.cfs.search_service.client.FileSearchClient;
import com.cfs.search_service.client.FolderSearchClient;
import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private FileSearchClient fileSearchClient;

    @Autowired
    private FolderSearchClient folderSearchClient;

    @Autowired
    private CircuitBreakerRegistry circuitBreakerRegistry;

    @GetMapping
    public Map<String, Object> search(@RequestParam String query) {

        System.out.println("[SEARCH] Request for query: " + query);

        CircuitBreaker fileServiceCB =
                circuitBreakerRegistry.circuitBreaker("file-service");

        List<Map<String, Object>> allFiles = new ArrayList<>();

        try {

            Supplier<List<Map<String, Object>>> fileCallable =
                    () -> fileSearchClient.getAllFiles();

            allFiles = fileServiceCB.executeSupplier(fileCallable);

        } catch (CallNotPermittedException e) {

            System.err.println("[SEARCH] Circuit Breaker OPEN");

        } catch (Exception e) {

            System.err.println("[SEARCH] File Service Error : " + e.getMessage());
        }

        List<Map<String, Object>> fileResult = allFiles.stream()
                .filter(f -> f.get("name").toString().toLowerCase()
                        .contains(query.toLowerCase()))
                .toList();

        List<Map<String, Object>> folderResult = folderSearchClient.getAllFolders()
                .stream()
                .filter(f -> f.get("name").toString().toLowerCase()
                        .contains(query.toLowerCase()))
                .toList();

        Map<String, Object> res = new HashMap<>();
        res.put("files", fileResult);
        res.put("folders", folderResult);

        return res;
    }

    @GetMapping("/files")
    public List<Map<String, Object>> searchFiles(@RequestParam String query) {

        return fileSearchClient.getAllFiles()
                .stream()
                .filter(f -> f.get("name").toString().toLowerCase()
                        .contains(query.toLowerCase()))
                .toList();
    }

    @GetMapping("/folders")
    public List<Map<String, Object>> searchFolders(@RequestParam String query) {

        return folderSearchClient.getAllFolders()
                .stream()
                .filter(f -> f.get("name").toString().toLowerCase()
                        .contains(query.toLowerCase()))
                .toList();
    }
}