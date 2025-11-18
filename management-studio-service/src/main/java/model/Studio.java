package com.mutrapro.studio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "studios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Studio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;
    private Integer capacity; // số người
    private String equipment; // mô tả ngắn danh sách thiết bị
    private Boolean active = true;
}
