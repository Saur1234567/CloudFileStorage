package com.cfs.search_service.client;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class FileServiceClientFallBack implements FileSearchClient {

    @Override
    public List<Map<String, Object>> getAllFiles() {
        System.err.println("[FALLBACK] File Service unavailable - returning empty list");
        return new ArrayList<>();
    }

    @Override
    public List<Map<String, Object>> getAllFilesByFolderId(Long folderId) {
        System.err.println("[FALLBACK] File Service unavailable for folder " + folderId);
        return new ArrayList<>();
    }
}