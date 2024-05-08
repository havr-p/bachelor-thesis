package uniba.fmph.traceability_tutor.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import uniba.fmph.traceability_tutor.model.HistoryAction;
import uniba.fmph.traceability_tutor.model.ItemType;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.Set;


@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Item {

    @Id
    @Column(nullable = false, updatable = false)
    @SequenceGenerator(
            name = "primary_sequence",
            sequenceName = "primary_sequence",
            allocationSize = 1,
            initialValue = 10000
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "primary_sequence"
    )
    private Long id;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ItemType itemType;

    @Column(nullable = false, columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, String> data;

    @Column
    private String status;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String projectInternalUid;

    @Column
    @Enumerated(EnumType.STRING)
    private HistoryAction historyAction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @OneToMany(mappedBy = "startItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Relationship> parentRelationships;

    @OneToMany(mappedBy = "endItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Relationship> childRelationships;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "release_id")
    private Release release;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private OffsetDateTime dateCreated;

    @LastModifiedDate
    @Column(nullable = false)
    private OffsetDateTime lastUpdated;

}
