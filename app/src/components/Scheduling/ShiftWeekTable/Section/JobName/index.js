import React, { PropTypes } from 'react';
import CreateShiftModal from '../../../CreateShiftModal';

require('./table-section-photo-name.scss');

function TableSectionJobName({ tableSize, startDate, name,
  timezone, toggleSchedulingModal, viewBy, employees, jobs,
  sectionUuid, createTeamShift, updateSchedulingModalFormData,
  clearSchedulingModalFormData, modalFormData, containerProps }) {
  return (
    <div className="shift-row-photo-name">
      <div className="name-column">
        <h4 className="row-name">{name}</h4>
      </div>
      <div className="button-column">
        <CreateShiftModal
          tableSize={tableSize}
          startDate={startDate}
          timezone={timezone}
          modalCallbackToggle={toggleSchedulingModal}
          containerComponent="button"
          viewBy={viewBy}
          selectedRow={sectionUuid}
          employees={employees}
          jobs={jobs}
          onSave={createTeamShift}
          modalFormData={modalFormData}
          updateSchedulingModalFormData={updateSchedulingModalFormData}
          clearSchedulingModalFormData={clearSchedulingModalFormData}
          sectionUuid={sectionUuid}
          containerProps={containerProps}
        />
      </div>
    </div>
  );
}

TableSectionJobName.propTypes = {
  name: PropTypes.string.isRequired,
  sectionUuid: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
  toggleSchedulingModal: PropTypes.func.isRequired,
  startDate: PropTypes.string.isRequired,
  tableSize: PropTypes.number.isRequired,
  viewBy: PropTypes.string.isRequired,
  employees: PropTypes.object.isRequired,
  jobs: PropTypes.object.isRequired,
  modalFormData: PropTypes.object.isRequired,
  updateSchedulingModalFormData: PropTypes.func.isRequired,
  clearSchedulingModalFormData: PropTypes.func.isRequired,
  createTeamShift: PropTypes.func.isRequired,
  containerProps: PropTypes.object.isRequired,
};

export default TableSectionJobName;
