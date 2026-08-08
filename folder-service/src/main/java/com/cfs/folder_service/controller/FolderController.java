package com.cfs.folder_service.controller;

import com.cfs.folder_service.model.FolderEntity;
import com.cfs.folder_service.repo.FolderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/folders")
public class FolderController {

    @Autowired
    private FolderRepository folderRepository;

    @GetMapping
    public List<FolderEntity> getAllFolders() {
        return folderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FolderEntity> getFolder(@PathVariable Long id) {
        return folderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public FolderEntity createFolder(@RequestBody FolderEntity folder) {
        return folderRepository.save(folder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFolder(@PathVariable Long id) {
        if (!folderRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        folderRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/parent/{parentId}")
    public List<FolderEntity> getFoldersByParent(@PathVariable Long parentId) {
        return folderRepository.findByParentId(parentId);
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createNewFolder(@RequestBody Map<String, Object> request) {
        try {
            String name = (String) request.get("name");
            Long parentId = request.get("parentId") != null
                    ? Long.valueOf(request.get("parentId").toString())
                    : null;

            if (name == null || name.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "name is required"));
            }

            FolderEntity newFolder = new FolderEntity();
            newFolder.setName(name);
            newFolder.setParentId(parentId);

            FolderEntity saved = folderRepository.save(newFolder);
            return ResponseEntity.ok(Map.of("success", true, "folder", saved));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}