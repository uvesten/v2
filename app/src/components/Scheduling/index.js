import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { DragDropContext as dragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import $ from 'npm-zepto';
import * as actions from 'actions';
import LoadingScreen from 'components/LoadingScreen';
import ShiftWeekTable from './ShiftWeekTable';
import SchedulingDateController from './DateController';
import SchedulingViewByController from './ViewByController';

require('./scheduling.scss');

class Scheduling extends React.Component {

  componentDidMount() {
    const { dispatch, companyUuid, teamUuid, routeQuery } = this.props;

    // initialize and get shifts
    // this will get the team, initialize params, initialize filters
    dispatch(actions.initializeScheduling(companyUuid, teamUuid, routeQuery));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, companyUuid, teamUuid, routeQuery } = this.props;
    const newTeamUuid = nextProps.teamUuid;

    // if changing between different scheduling views, the same component
    // instance is used, so this is checks to get data
    if (newTeamUuid !== teamUuid) {
      dispatch(
        actions.initializeScheduling(companyUuid, newTeamUuid, routeQuery)
      );
    }
  }

  render() {
    const { isFetching, params, filters, employees, jobs,
      shifts, timezone, stepDateRange, changeViewBy, droppedSchedulingCard,
      deleteTeamShift, toggleSchedulingModal, modalOpen, editTeamShift,
      updateSchedulingModalFormData, createTeamShift, modalFormData,
      clearSchedulingModalFormData, isSaving, companyUuid,
      teamUuid, t } = this.props;
    const tableSize = 7;
    const viewBy = filters.viewBy;
    const startDate = params.startDate;

    if (isFetching) {
      return (
        <LoadingScreen />
      );
    }

    // TODO - add publish button into top controls

    return (
      <div className="scheduling-container">
        <ul className="scheduling-controls">
          <li className="header">
            {t('navLinks.scheduler')}
          </li>
          <li className="control-unit">
            <SchedulingViewByController
              onClick={changeViewBy}
              viewBy={viewBy}
              disabled={isSaving}
            />
          </li>
          <li className="date-control-unit">
            <SchedulingDateController
              queryStart={params.range.start}
              queryStop={params.range.stop}
              timezone={timezone}
              stepDateRange={stepDateRange}
              disabled={isSaving}
            />
          </li>
        </ul>
        {(() =>
          // TODO when we have more views, determine which view type to use
          // if (props.params.viewType === 'week') {
          <ShiftWeekTable
            droppedSchedulingCard={droppedSchedulingCard}
            startDate={startDate}
            tableSize={tableSize}
            timezone={timezone}
            employees={employees}
            jobs={jobs}
            shifts={shifts}
            filters={filters}
            viewBy={viewBy}
            deleteTeamShift={deleteTeamShift}
            toggleSchedulingModal={toggleSchedulingModal}
            modalOpen={modalOpen}
            modalFormData={modalFormData}
            editTeamShift={editTeamShift}
            createTeamShift={createTeamShift}
            updateSchedulingModalFormData={updateSchedulingModalFormData}
            clearSchedulingModalFormData={clearSchedulingModalFormData}
            onCardZAxisChange={this.props.handleCardZAxisChange}
            isSaving={isSaving}
            companyUuid={companyUuid}
            teamUuid={teamUuid}
          />
        )()}
      </div>
    );
  }
}

Scheduling.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  routeQuery: PropTypes.object.isRequired,
  companyUuid: PropTypes.string.isRequired,
  teamUuid: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  employees: PropTypes.object.isRequired,
  jobs: PropTypes.object.isRequired,
  shifts: PropTypes.arrayOf(PropTypes.object).isRequired,
  timezone: PropTypes.string.isRequired,
  stepDateRange: PropTypes.func.isRequired,
  changeViewBy: PropTypes.func.isRequired,
  droppedSchedulingCard: PropTypes.func.isRequired,
  deleteTeamShift: PropTypes.func.isRequired,
  toggleSchedulingModal: PropTypes.func.isRequired,
  editTeamShift: PropTypes.func.isRequired,
  createTeamShift: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  modalFormData: PropTypes.object.isRequired,
  updateSchedulingModalFormData: PropTypes.func.isRequired,
  clearSchedulingModalFormData: PropTypes.func.isRequired,
  handleCardZAxisChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const teamUuid = ownProps.routeParams.teamUuid;

  // consts for team data
  const teamData = _.get(state.teams.data, teamUuid, {});
  const isTeamFetching = state.teams.isFetching;
  const timezone = _.get(teamData, 'timezone', 'UTC');

  // consts for shift data
  const shiftState = _.get(state.teams.shifts, teamUuid, {});
  const shifts = _.values(_.get(shiftState, 'data', {}));
  const isShiftSaving = _.get(shiftState, 'isSaving', false);

  // consts for job data
  const jobState = _.get(state.teams.jobs, teamUuid, {});
  const isJobFetching = _.get(jobState, 'isFetching', true);
  const jobs = _.get(jobState, 'data', {});

  // consts for employee data
  const employeeState = _.get(state.teams.employees, teamUuid, {});
  const isEmployeeFetching = _.get(employeeState, 'isFetching', true);
  const employees = _.get(employeeState, 'data', {});

  // scheduling
  const schedulingState = state.scheduling;
  const schedulingParams = schedulingState.params;
  const schedulingFilters = schedulingState.filters;

  const isSchedulingParamsFetching = schedulingParams.isFetching;
  const isSchedulingFiltersFetching = schedulingFilters.isFetching;

  const isFetching =
    isTeamFetching ||
    isJobFetching ||
    isEmployeeFetching ||
    isSchedulingFiltersFetching ||
    isSchedulingParamsFetching ||
    _.isEmpty(schedulingParams);

  const isSaving =
    isShiftSaving;

  return {
    companyUuid: ownProps.routeParams.companyUuid,
    routeQuery: ownProps.location.query,
    isFetching,
    isSaving,
    params: schedulingParams,
    filters: schedulingFilters,
    modalOpen: schedulingState.modal.modalOpen,
    modalFormData: schedulingState.modal.formData,
    teamUuid,
    timezone,
    jobs,
    employees,
    shifts,
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeViewBy: (event) => {
    const newView = $(event.target).data('id');
    const { teamUuid } = ownProps.routeParams;

    dispatch(actions.changeViewBy(newView, teamUuid));
  },
  stepDateRange: (event) => {
    const { companyUuid, teamUuid } = ownProps.routeParams;
    const direction = $(event.target)
      .closest('.square-button')
      .data('direction');

    dispatch(actions.stepDateRange(companyUuid, teamUuid, direction));
  },
  droppedSchedulingCard: (shiftUuid, oldColumnId, sectionUuid, newColumnId) => {
    const { companyUuid, teamUuid } = ownProps.routeParams;

    dispatch(actions.droppedSchedulingCard(
      companyUuid,
      teamUuid,
      shiftUuid,
      oldColumnId,
      sectionUuid,
      newColumnId
    ));
  },
  editTeamShift: (shiftUuid, timezone) => {
    const { companyUuid, teamUuid } = ownProps.routeParams;

    dispatch(actions.editTeamShiftFromModal(
      companyUuid,
      teamUuid,
      shiftUuid,
      timezone
    ));
  },
  createTeamShift: (timezone) => {
    const { companyUuid, teamUuid } = ownProps.routeParams;
    dispatch(
      actions.createTeamShiftsFromModal(companyUuid, teamUuid, timezone)
    );
  },
  deleteTeamShift: (shiftUuid) => {
    const { companyUuid, teamUuid } = ownProps.routeParams;

    dispatch(actions.deleteTeamShift(companyUuid, teamUuid, shiftUuid));
  },
  toggleSchedulingModal: (value) => {
    dispatch(actions.toggleSchedulingModal(value));
  },
  updateSchedulingModalFormData: (data) => {
    dispatch(actions.updateSchedulingModalFormData(data));
  },
  clearSchedulingModalFormData: (data) => {
    dispatch(actions.clearSchedulingModalFormData(data));
  },
  handleCardZAxisChange: ({ key, shiftUuid, value }) => {
    const { companyUuid, teamUuid } = ownProps.routeParams;
    const newData = { [key]: value };

    dispatch(actions.updateTeamShift(
      companyUuid,
      teamUuid,
      shiftUuid,
      newData
    ));
  },
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(dragDropContext(HTML5Backend)(translate('common')(Scheduling)));
