# WeDecide Thyroid Cancer Application

This application consists of the following pieces

* [`index.html`](index.html): A symbolic link to `demographics.html`
* [`demographics.html`](demographics.html): The place to start the application.  This solicits the patient demographic information and then moves forward to [`walk1.html`](walk1.html) the first page of the patient walk through of information.
* [`dr.html`](dr.html): Provides the physician information about the current patient and allows for the choice of the other patients.
* [`notes.html`](notes.html): The place for the physician to input their notes about the patient, and view other patient notes.
* [`pairwise.html`](pairwise.html): The pairwise comparison screens for the current user.  You need to start at demographics for this to work.
* [`results.html`](results.html): The results of the current pairwise comparison.
* `walk*.html`: These are the walkthrough pages.  They can refer to each other in different orders.  However [walk-last.html](walk-last.html) should always be the last walk through page and [walk1.html](walk1.html) should always be the first.
