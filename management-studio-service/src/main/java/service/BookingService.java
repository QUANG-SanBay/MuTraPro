package com.mutrapro.studio.service;

import com.mutrapro.studio.dto.BookingRequestDto;
import com.mutrapro.studio.dto.BookingResponseDto;
import com.mutrapro.studio.entity.Booking;
import com.mutrapro.studio.entity.Studio;
import com.mutrapro.studio.exception.BadRequestException;
import com.mutrapro.studio.exception.NotFoundException;
import com.mutrapro.studio.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final StudioService studioService;

    private static final List<Booking.Status> ACTIVE_STATUSES = Arrays.asList(
            Booking.Status.PENDING, Booking.Status.CONFIRMED
    );

    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto req) {
        if (!req.getEndTime().isAfter(req.getStartTime())) {
            throw new BadRequestException("End time must be after start time");
        }

        Studio studio = studioService.getById(req.getStudioId());

        // Kiểm tra xung đột
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                studio, req.getStartTime(), req.getEndTime(), ACTIVE_STATUSES
        );

        if (!conflicts.isEmpty()) {
            throw new BadRequestException("Selected time slot conflicts with existing booking");
        }

        Booking booking = Booking.builder()
                .studio(studio)
                .customerId(req.getCustomerId())
                .customerName(req.getCustomerName())
                .purpose(req.getPurpose())
                .startTime(req.getStartTime())
                .endTime(req.getEndTime())
                .status(Booking.Status.PENDING)
                .notes(req.getNotes())
                .build();

        Booking saved = bookingRepository.save(booking);
        return toDto(saved);
    }

    public BookingResponseDto getBooking(Long id) {
        Booking b = bookingRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Booking not found: " + id));
        return toDto(b);
    }

    @Transactional
    public BookingResponseDto updateStatus(Long bookingId, Booking.Status newStatus) {
        Booking b = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Booking not found: " + bookingId));
        b.setStatus(newStatus);
        bookingRepository.save(b);
        return toDto(b);
    }

    public List<BookingResponseDto> listByCustomer(Long customerId) {
        return bookingRepository.findByCustomerId(customerId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private BookingResponseDto toDto(Booking b) {
        return BookingResponseDto.builder()
                .id(b.getId())
                .studioId(b.getStudio().getId())
                .customerId(b.getCustomerId())
                .customerName(b.getCustomerName())
                .purpose(b.getPurpose())
                .startTime(b.getStartTime())
                .endTime(b.getEndTime())
                .status(b.getStatus())
                .notes(b.getNotes())
                .build();
    }
}
