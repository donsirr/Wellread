const fs = require('fs');
const state = JSON.parse(fs.readFileSync('src/state.json', 'utf8'));
state.patientDatabase.forEach(p => {
    if (p.patientProfile.name === 'Maria Dela Cruz') {
        p.mcpSources = [
            { id: 'src-bp-log', type: 'Withings App', status: 'analyzed', contentSnippet: 'BP trending upwards over last 14 days, averaging 145/92.', name: 'BP Remote Sync', date: 'Mar 7, 2026', iconType: 'Activity', privacyStatus: 'local_only' },
            { id: 'src-email', type: 'Gmail', status: 'analyzed', contentSnippet: 'Patient emailed asking about headache frequency.', name: 'Patient Email', date: 'Mar 5, 2026', iconType: 'Mail', privacyStatus: 'cloud_only' }
        ];
        p.clinicalMetrics = [
            { id: 'metric-bp', label: 'Blood Pressure', value: '145/92', unit: 'mmHg', isAlert: true, alertBadge: '+10 mmHg in 2wks', sparkData: [130, 132, 135, 140, 142, 144, 145], iconType: 'Gauge' },
            { id: 'metric-hr', label: 'Heart Rate', value: '78', unit: 'bpm', sparkData: [72, 74, 75, 76, 76, 77, 78], iconType: 'Heart' }
        ];
        p.correlations = [
            { id: 'corr-maria', sourceID: 'src-bp-log', metricID: 'metric-bp', description: 'Recent stress indicated in emails correlates with sustained hypertensive trend.', active: true }
        ];
        p.narrative = {
            title: 'Hypertension Exacerbation',
            confidence: 88,
            sourceText1: 'Maria, your ', highlight1: 'recent blood pressure readings', sourceText2: ' are consistently elevated above target, correlating with ', highlight2: 'reported headaches', sourceText3: '.', insightSources: '2 sources'
        };
        p.consultation = {
            trajectory: 'Increasing BP trends detected via home monitoring. Adjustment of anti-hypertensive regimen indicated.',
            observations: [{ text: 'BP averaging 145/92.', severity: 'medium' }],
            questions: ['Have you been taking your medication consistently?', 'Are the headaches worse in the morning?']
        };
    } else if (p.patientProfile.name === 'John Doe') {
        p.mcpSources = [
            { id: 'src-fitbit', type: 'Fitbit Data', status: 'analyzed', contentSnippet: 'Average 8,500 steps/day. Resting HR 65.', name: 'Activity Log', date: 'Mar 8, 2026', iconType: 'Activity', privacyStatus: 'local_only' }
        ];
        p.clinicalMetrics = [
            { id: 'metric-bp', label: 'Blood Pressure', value: '120/80', unit: 'mmHg', sparkData: [118, 119, 120, 125, 122, 121, 120], iconType: 'Gauge' },
            { id: 'metric-hr', label: 'Resting HR', value: '65', unit: 'bpm', sparkData: [68, 67, 66, 65, 64, 65, 65], iconType: 'Heart' }
        ];
        p.correlations = [];
        p.narrative = {
            title: 'Healthy Baseline Established',
            confidence: 95,
            sourceText1: 'John, your ', highlight1: 'activity levels', sourceText2: ' and ', highlight2: 'cardiac metrics', sourceText3: ' are well within normal ranges for your age.', insightSources: '1 source'
        };
        p.consultation = {
            trajectory: 'Patient establishing care. Baseline metrics reflect excellent cardiovascular health.',
            observations: [{ text: 'Resting HR is 65 bpm.', severity: 'low' }],
            questions: ['Any family history of cardiovascular disease?']
        };
    } else if (p.patientProfile.name === 'Jane Doe') {
        p.mcpSources = [
            { id: 'src-oura', type: 'Oura Ring', status: 'analyzed', contentSnippet: 'Sleep quality degraded over past 4 days.', name: 'Sleep Sync', date: 'Mar 8, 2026', iconType: 'Moon', privacyStatus: 'local_only' }
        ];
        p.clinicalMetrics = [
            { id: 'metric-sleep', label: 'Sleep Duration', value: '5h 10m', unit: 'avg', isAlert: true, alertBadge: '-1.5h this week', sparkData: [7, 7, 6.5, 6, 5, 4.5, 5.1], iconType: 'Activity' },
            { id: 'metric-hrv', label: 'HRV', value: '42', unit: 'ms', sparkData: [55, 50, 48, 45, 40, 39, 42], iconType: 'Heart' }
        ];
        p.correlations = [
            { id: 'corr-jane', sourceID: 'src-oura', metricID: 'metric-sleep', description: 'Sleep debt strongly correlates with declining HRV scores.', active: true }
        ];
        p.narrative = {
            title: 'Recovery Metrics Declining',
            confidence: 90,
            sourceText1: 'Jane, your ', highlight1: 'recent sleep duration', sourceText2: ' drop has resulted in noticeably lower ', highlight2: 'heart rate variability', sourceText3: ' than your baseline.', insightSources: '1 source'
        };
        p.consultation = {
            trajectory: 'Patient undergoing period of high physiological strain, evidenced by reduced sleep and depressed HRV.',
            observations: [{ text: 'HRV has dropped below baseline.', severity: 'medium' }],
            questions: ['What has changed in your evening routine recently?']
        };
    }
});
fs.writeFileSync('src/state.json', JSON.stringify(state, null, 4));
