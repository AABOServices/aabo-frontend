/**
 * ExternalNorms - External industry standards (API, ASME, ISO, etc.)
 * @module features/knowledgeHub/standards/components/ExternalNorms
 */

import { useState } from 'react';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import Button from '../../../../../components/shared/Button';
import Modal from '../../../../../components/shared/Modal';
import SearchBar from '../../../../../components/shared/SearchBar';
import Select from '../../../../../components/shared/Select';
import Badge from '../../../../../components/shared/Badge';
import UploadStandardModal from '../UploadStandardModal';
import VersionControl from '../VersionControl';
import useStandards from '../../hooks/useStandards';
import { formatDate } from '../../../../../utils';
import styles from './ExternalNorms.module.css';

const ExternalNorms = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [organizationFilter, setOrganizationFilter] = useState('');
  const [selectedNorm, setSelectedNorm] = useState(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const { externalNorms, loading } = useStandards('external');

  const organizationOptions = [
    { value: '', label: 'Todas las organizaciones' },
    { value: 'API', label: 'API (American Petroleum Institute)' },
    { value: 'ASME', label: 'ASME (American Society of Mechanical Engineers)' },
    { value: 'ISO', label: 'ISO (International Organization for Standardization)' },
    { value: 'ASTM', label: 'ASTM (American Society for Testing and Materials)' },
    { value: 'IEEE', label: 'IEEE (Institute of Electrical and Electronics Engineers)' },
    { value: 'NFPA', label: 'NFPA (National Fire Protection Association)' },
    { value: 'ANSI', label: 'ANSI (American National Standards Institute)' }
  ];

  const filteredNorms = externalNorms.filter(norm => {
    const matchesSearch =
      norm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      norm.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (norm.description && norm.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesOrganization = !organizationFilter || norm.organization === organizationFilter;

    return matchesSearch && matchesOrganization;
  });

  return (
    <div className={styles.container}>

      {/* Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.filters}>
          <div className={styles.searchWrapper}>
            <SearchBar
              placeholder="Buscar normativas por título o código..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <div className={styles.filterItem}>
            <label className={styles.filterLabel}>Organización</label>
            <Select
              value={organizationFilter}
              onChange={setOrganizationFilter}
              options={organizationOptions}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando normativas externas...</p>
        </div>
      ) : (
        <>
          {filteredNorms.length > 0 ? (
            <div className={styles.normsList}>
              {filteredNorms.map((norm) => (
                <div 
                  key={norm.id} 
                  className={styles.normItem}
                  data-status={norm.isActive ? 'active' : 'inactive'}
                  onClick={() => setSelectedNorm(norm)}
                >
                  {/* Card Header - Date and Code */}
                  <div className={styles.cardHeader}>
                    <span className={styles.cardDate}>{formatDate(norm.publishDate)}</span>
                    <span className={styles.cardCode}>{norm.code}</span>
                  </div>
                  
                  {/* Card Title */}
                  <h3 className={styles.cardTitle}>{norm.title}</h3>
                  
                  {/* Card Description */}
                  {norm.description && (
                    <p className={styles.cardDescription}>{norm.description}</p>
                  )}
                  
                  {/* Card Footer - Organization and Status */}
                  <div className={styles.cardFooter}>
                    <span className={styles.cardOrganization}>{norm.organization}</span>
                    <div className={styles.cardStatus}>
                      <span className={styles.statusIcon}>
                        {norm.isActive ? '✔' : '⏸️'}
                      </span>
                      <span className={styles.statusText}>
                        {norm.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Bottom Right */}
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.actionButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement view document
                        console.log('Ver documento:', norm.id);
                      }}
                      title="Ver documento"
                    >
                      <VisibilityOutlinedIcon fontSize="small" />
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement download PDF
                        console.log('Descargar PDF:', norm.id);
                      }}
                      title="Descargar PDF"
                    >
                      <DownloadOutlinedIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>🌐 No se encontraron normativas con los filtros aplicados</p>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selectedNorm && (
        <Modal
          isOpen={!!selectedNorm}
          onClose={() => setSelectedNorm(null)}
          title="Detalle de Normativa Externa"
          size="medium"
        >
          <div className={styles.detailContent}>
            <div className={styles.detailHeader}>
              <h2 className={styles.detailTitle}>{selectedNorm.title}</h2>
              <div className={styles.detailBadges}>
                <Badge variant="info">{selectedNorm.organization}</Badge>
                {selectedNorm.isActive && <Badge variant="success">Activo</Badge>}
              </div>
            </div>
            
            <div className={styles.detailSection}>
              <label className={styles.detailLabel}>Código</label>
              <p className={styles.detailValue}>{selectedNorm.code}</p>
            </div>

            <div className={styles.detailSection}>
              <label className={styles.detailLabel}>Organización</label>
              <p className={styles.detailValue}>{selectedNorm.organization}</p>
            </div>

            <div className={styles.detailSection}>
              <label className={styles.detailLabel}>Versión</label>
              <p className={styles.detailValue}>{selectedNorm.version}</p>
            </div>

            <div className={styles.detailSection}>
              <label className={styles.detailLabel}>Fecha de Publicación</label>
              <p className={styles.detailValue}>{formatDate(selectedNorm.publishDate)}</p>
            </div>

            {selectedNorm.description && (
              <div className={styles.detailSection}>
                <label className={styles.detailLabel}>Descripción</label>
                <p className={styles.detailValue}>{selectedNorm.description}</p>
              </div>
            )}

            {selectedNorm.link && (
              <div className={styles.detailSection}>
                <label className={styles.detailLabel}>Enlace Externo</label>
                <a href={selectedNorm.link} target="_blank" rel="noopener noreferrer" className={styles.detailLink}>
                  {selectedNorm.link}
                </a>
              </div>
            )}

            <div className={styles.detailActions}>
              <Button variant="primary">📄 Descargar Documento</Button>
              <Button 
                variant="outline"
                onClick={() => setShowVersionHistory(true)}
              >
                📋 Ver Historial de Versiones
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Version History Modal */}
      {selectedNorm && showVersionHistory && (
        <Modal
          isOpen={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
          title="📋 Historial de Versiones"
          size="large"
        >
          <VersionControl type="external" entityId={selectedNorm.id} />
        </Modal>
      )}

    </div>
  );
};

export default ExternalNorms;

