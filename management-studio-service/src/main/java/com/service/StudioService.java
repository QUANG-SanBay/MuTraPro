package com.mutrapro.studio.service;

import com.mutrapro.studio.dto.StudioDto;
import com.mutrapro.studio.entity.Studio;
import com.mutrapro.studio.exception.NotFoundException;
import com.mutrapro.studio.repository.StudioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudioService {
    private final StudioRepository studioRepository;

    public List<StudioDto> listActiveStudios() {
        return studioRepository.findByActiveTrue().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Studio getById(Long id) {
        return studioRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Studio not found with id: " + id));
    }

    private StudioDto toDto(Studio s) {
        return StudioDto.builder()
                .id(s.getId())
                .name(s.getName())
                .location(s.getLocation())
                .capacity(s.getCapacity())
                .equipment(s.getEquipment())
                .build();
    }
}
