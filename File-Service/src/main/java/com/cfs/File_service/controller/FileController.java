package com.cfs.File_service.controller;

import com.cfs.File_service.model.FileEntity;
import com.cfs.File_service.repo.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileRepository fileRepository;

    private static final String UPLOAD_DIR = "uploads";

    @GetMapping
    public List<FileEntity> getAllFiles() {
        return fileRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FileEntity> getFile(@PathVariable Long id) {
        return fileRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public FileEntity createFile(@RequestBody FileEntity file) {
        return fileRepository.save(file);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long id) {
        if (!fileRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        fileRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/folder/{folderId}")
    public List<FileEntity> getFilesByFolder(@PathVariable Long folderId) {
        return fileRepository.findByFolderId(folderId);
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadFile(
            @RequestParam("name") String name,
            @RequestParam(value = "folderId", required = false) Long folderId,
            @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "uploaded file is empty"));
            }

            String fileName = file.getOriginalFilename();
            long fileSize = file.getSize();

            FileEntity newFile = new FileEntity();
            newFile.setName(fileName != null ? fileName : name);
            newFile.setFolderId(folderId); // null is fine now — means root
            newFile.setSize(fileSize);

            FileEntity saved = fileRepository.save(newFile);

            String uploadDirPath = UPLOAD_DIR + File.separator + saved.getId();
            Files.createDirectories(Paths.get(uploadDirPath));

            Path filePath = Paths.get(uploadDirPath, saved.getName());
            Files.write(filePath, file.getBytes());

            saved.setPath("/files/" + saved.getId());
            saved = fileRepository.save(saved);

            return ResponseEntity.ok(Map.of("success", true, "file", saved));

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to write file: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadFile(@PathVariable Long id) {
        try {
            FileEntity file = fileRepository.findById(id).orElse(null);
            if (file == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File record not found");
            }

            Path filePath = Paths.get(UPLOAD_DIR, id.toString(), file.getName());

            if (!Files.exists(filePath)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found on disk");
            }

            byte[] fileContent = Files.readAllBytes(filePath);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE)
                    .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(fileContent.length))
                    .body(fileContent);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error in downloading: " + e.getMessage());
        }
    }
}