package com.mutrapro.order_service.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String storeFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IOException("File rỗng");
        }

        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        // Path dựa trên project root
        Path uploadPath = Paths.get(System.getProperty("user.dir"), uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        File dest = new File(uploadPath.toFile(), fileName);

        // Tạo folder cha nếu chưa có
        if (!dest.getParentFile().exists()) {
            dest.getParentFile().mkdirs();
        }

        System.out.println("Saving file to: " + dest.getAbsolutePath());

        file.transferTo(dest);

        return dest.getAbsolutePath();
    }
}
