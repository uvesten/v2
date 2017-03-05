import _ from 'lodash';
import React, { PropTypes } from 'react';
import { translate } from 'react-i18next';
import StaffjoyButton from 'components/StaffjoyButton';
import { SCHEDULING_VIEW_BY_OPTIONS } from 'constants/config';

require('./scheduling-view-by-controller.scss');

function SchedulingViewByController({ viewBy, onClick, disabled = false, t }) {
  return (
    <div className="scheduling-view-by-controller">
      {
        _.map(SCHEDULING_VIEW_BY_OPTIONS, (buttonView) => {
          const key = `viewBy-${buttonView.id}`;
          return (
            <StaffjoyButton
              key={key}
              data-id={buttonView.id}
              onClick={onClick}
              buttonType="outline-dark"
              active={viewBy === buttonView.id}
              disabled={disabled}
            >
              {t(`viewBy${buttonView.name}`)}
            </StaffjoyButton>
          );
        })
      }
    </div>
  );
}

SchedulingViewByController.propTypes = {
  viewBy: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

export default translate('common')(SchedulingViewByController);
