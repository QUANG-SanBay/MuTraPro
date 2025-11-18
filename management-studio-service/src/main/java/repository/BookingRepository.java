package com.mutrapro.studio.repository;

import com.mutrapro.studio.entity.Booking;
import com.mutrapro.studio.entity.Studio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByStudioAndStatusIn(Studio studio, List<Booking.Status> statuses);

    // Kiểm tra xung đột booking cho studio trong khoảng thời gian
    @Query("SELECT b FROM Booking b WHERE b.studio = :studio AND b.status IN :statuses "
         + "AND ((b.startTime < :endTime AND b.endTime > :startTime))")
    List<Booking> findConflictingBookings(Studio studio, LocalDateTime startTime, LocalDateTime endTime, List<Booking.Status> statuses);

    List<Booking> findByCustomerId(Long customerId);
}
