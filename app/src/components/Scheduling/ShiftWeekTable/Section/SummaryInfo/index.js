import _ from 'lodash';
import moment from 'moment';
import 'moment-timezone';
import React, { PropTypes } from 'react';
import { translate } from 'react-i18next';
import { getFormattedDuration } from '../../../../../utility';

require('./section-summary-info.scss');

class SectionSummaryInfo extends React.Component {

  summarizeShifts() {
    const { shifts, timezone, t } = this.props;

    const durationMs = _.reduce(shifts, (duration, shift) => {
      const momentStart = moment.utc(shift.start).tz(timezone);
      const momentStop = moment.utc(shift.stop).tz(timezone);
      const currentDuration = momentStop - momentStart;

      return duration + currentDuration;
    }, 0);

    const { hr, m } = getFormattedDuration(durationMs);
    const format = [];

    if (hr > 0) {
      format.push(`${hr} ${t('hours')}`);
    }

    if (m > 0) {
      format.push(`${m} ${t('minutes')}`);
    }

    const formattedDuration = [t('total')].concat(format).join(' ');
    return (format.length > 0) ? formattedDuration : t('noTimeAssigned');
  }

  render() {
    return (
      <div className="section-summary-info">
        <span>{this.summarizeShifts()}</span>
      </div>
    );
  }

}

SectionSummaryInfo.propTypes = {
  shifts: PropTypes.array.isRequired,
  timezone: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default translate('common')(SectionSummaryInfo);
