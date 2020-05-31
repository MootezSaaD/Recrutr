const recruitersService = require('../services/recruiters.service')();
const jobsService = require('../services/jobs.service')();

function permit(...allowed) {
    const isAllowed = role => allowed.indexOf(role) > -1;
    return (req, res, next) => {
        if (req.user && isAllowed(req.user.role))
            next();
        else {
            res.status(403).json({ message: "Forbidden" });
        }
    }
}

/**
 *  The following middleware checks whether the recruiter can
 *  perform operations on a job offer (delete, edit, etc.)
 *  The latter is only possible when the recruiter and the job offer
 *  share the same companyId
 *  Note: isCompanyRecruiter should be used only after permit('recruiter')
 */
function isCompanyRecruiter(req, res, next) {
    recruitersService.getRecruiter(req.user.email)
        .then(recruiter => {
            jobsService.getJobById(req.params.jobId)
                .then(job => {
                    if (recruiter.CompanyId === job.CompanyId)
                        next();
                    else {
                        res.status(403).json({ message: "Recruiter cannot perform this action" });
                    }
                }).catch(err => {
                    res.status(500).json({ message: "Job offer not found" });
                })
        }).catch(err => {
            res.status(500).json({ message: "Recruiter not found" });
        })
}


module.exports = {
    permit: permit,
    isCompanyRecruiter: isCompanyRecruiter,
};