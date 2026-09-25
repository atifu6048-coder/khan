/**
 * LEADS SCHOOL SYSTEM - ONLINE ADMISSION PORTAL JAVASCRIPT
 * Comprehensive interactive engine for Form steps, Fee calculation,
 * Status tracking, Modal handling, and Voucher printing.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. DATA STORAGE & INITIAL DEMO DATA
  // ==========================================
  const STORAGE_KEY = 'leads_admissions_records';

  const defaultRecords = [
    {
      appId: 'LSS-2026-8942',
      date: 'Sep 22, 2026',
      studentName: 'Ayaan Tariq Khan',
      studentDob: '2019-04-15',
      studentGender: 'Male',
      studentGrade: 'Grade 1',
      studentBForm: '35201-8472911-3',
      prevSchool: 'Beaconhouse School System',
      prevGradeResult: 'Grade A (89%)',
      fatherName: 'Tariq Mehmood Khan',
      fatherCnic: '35202-1829384-1',
      fatherPhone: '0300-8451290',
      parentEmail: 'tariq.khan@gmail.com',
      fatherOccupation: 'Senior Software Architect',
      motherName: 'Sadia Tariq',
      homeAddress: 'House 42, Street 8, Block G, Johar Town, Lahore',
      campus: 'Main Campus - Gulberg / Model Town',
      concession: 'Kinship / Sibling (20% Off)',
      transport: 'Yes - Zone 1',
      status: 'Assessment Scheduled',
      interviewDate: 'Upcoming Saturday, 10:00 AM'
    },
    {
      appId: 'LSS-2026-4519',
      date: 'Sep 23, 2026',
      studentName: 'Zainab Fatima',
      studentDob: '2018-09-10',
      studentGender: 'Female',
      studentGrade: 'Grade 3',
      studentBForm: '35201-9988112-2',
      prevSchool: 'Lahore Grammar School',
      prevGradeResult: '94%',
      fatherName: 'Dr. Usman Farooq',
      fatherCnic: '35201-4477881-5',
      fatherPhone: '0321-9988776',
      parentEmail: 'usman.farooq@health.gov.pk',
      fatherOccupation: 'Consultant Physician',
      motherName: 'Dr. Ayesha Usman',
      homeAddress: 'Sector J, Phase 5, DHA Lahore',
      campus: 'DHA Executive Campus - Phase 5',
      concession: 'Academic Merit 85%+ (30% Off)',
      transport: 'No',
      status: 'Application Verified',
      interviewDate: 'Upcoming Tuesday, 11:30 AM'
    }
  ];

  function getStoredApplications() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRecords));
        return defaultRecords;
      }
      return JSON.parse(data);
    } catch (e) {
      return defaultRecords;
    }
  }

  function saveApplication(newRecord) {
    const list = getStoredApplications();
    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  // ==========================================
  // 2. TOAST NOTIFICATIONS
  // ==========================================
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, isSuccess = true) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${isSuccess ? 'toast-success' : ''}`;
    toast.innerHTML = `
      <span>${isSuccess ? '✓' : 'ℹ'}</span>
      <div>${message}</div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ==========================================
  // 3. MOBILE MENU & HEADER SCROLL
  // ==========================================
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close menu on click of nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // ==========================================
  // 4. PROGRAM TABS SWITCHER
  // ==========================================
  const programTabs = document.querySelectorAll('.program-tabs .tab-btn');
  const programContents = document.querySelectorAll('.program-tab-content');

  programTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      programTabs.forEach(b => b.classList.remove('active'));
      programContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // Global helper for CTA buttons in program cards
  window.preselectGrade = function(gradeName) {
    const gradeSelect = document.getElementById('studentGrade');
    if (gradeSelect) {
      for (let i = 0; i < gradeSelect.options.length; i++) {
        if (gradeSelect.options[i].value === gradeName) {
          gradeSelect.selectedIndex = i;
          break;
        }
      }
    }
    const applySection = document.getElementById('apply');
    if (applySection) {
      applySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ==========================================
  // 5. FEE & SCHOLARSHIP CALCULATOR
  // ==========================================
  const calcGrade = document.getElementById('calcGrade');
  const calcDiscount = document.getElementById('calcDiscount');
  const calcTransport = document.getElementById('calcTransport');
  const baseTuitionText = document.getElementById('baseTuitionText');
  const discountAppliedText = document.getElementById('discountAppliedText');
  const transportCostText = document.getElementById('transportCostText');
  const netMonthlyTotal = document.getElementById('netMonthlyTotal');
  const calcApplyBtn = document.getElementById('calcApplyBtn');

  const gradeBaseFees = {
    playgroup: 6500,
    prep: 7200,
    primary: 8500,
    middle: 9800,
    matric: 11500,
    olevels: 16500
  };

  function updateFeeCalculation() {
    if (!calcGrade) return;
    const selectedGrade = calcGrade.value;
    const baseFee = gradeBaseFees[selectedGrade] || 8500;
    const discountPercent = parseInt(calcDiscount.value, 10) || 0;
    const transportCost = parseInt(calcTransport.value, 10) || 0;

    const discountAmount = Math.round((baseFee * discountPercent) / 100);
    const discountedTuition = baseFee - discountAmount;
    const netTotal = discountedTuition + transportCost;

    baseTuitionText.textContent = `Rs. ${baseFee.toLocaleString()}`;
    discountAppliedText.textContent = discountPercent > 0 
      ? `- Rs. ${discountAmount.toLocaleString()} (${discountPercent}%)` 
      : `Rs. 0`;
    transportCostText.textContent = transportCost > 0 
      ? `+ Rs. ${transportCost.toLocaleString()}` 
      : `Rs. 0`;
    netMonthlyTotal.textContent = `Rs. ${netTotal.toLocaleString()}`;
  }

  if (calcGrade && calcDiscount && calcTransport) {
    calcGrade.addEventListener('change', updateFeeCalculation);
    calcDiscount.addEventListener('change', updateFeeCalculation);
    calcTransport.addEventListener('change', updateFeeCalculation);
    updateFeeCalculation();
  }

  // Pre-fill form from calculator
  if (calcApplyBtn) {
    calcApplyBtn.addEventListener('click', () => {
      const selectedGrade = calcGrade.value;
      const discountVal = calcDiscount.value;

      // Map to form values
      const gradeSelect = document.getElementById('studentGrade');
      const concessionSelect = document.getElementById('concessionCategory');

      if (gradeSelect) {
        if (selectedGrade === 'playgroup') gradeSelect.value = 'Playgroup';
        else if (selectedGrade === 'prep') gradeSelect.value = 'Prep';
        else if (selectedGrade === 'primary') gradeSelect.value = 'Grade 1';
        else if (selectedGrade === 'middle') gradeSelect.value = 'Grade 6';
        else if (selectedGrade === 'matric') gradeSelect.value = 'Grade 9 (Matric)';
        else if (selectedGrade === 'olevels') gradeSelect.value = 'O-Levels Year 1';
      }

      if (concessionSelect) {
        if (discountVal === '20') concessionSelect.value = 'Kinship / Sibling (20% Off)';
        else if (discountVal === '30') concessionSelect.value = 'Academic Merit 85%+ (30% Off)';
        else if (discountVal === '50') concessionSelect.value = 'High Achiever 95%+ (50% Off)';
        else if (discountVal === '25') concessionSelect.value = 'Hafiz-e-Quran (25% Off)';
        else if (discountVal === '35') concessionSelect.value = 'Armed Forces / Shuhada (35% Off)';
      }

      showToast('Fee selection carried over to Admission Form!');
      document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ==========================================
  // 6. MULTI-STEP ADMISSION FORM
  // ==========================================
  const form = document.getElementById('admissionForm');
  const stepPanels = [
    document.getElementById('step1'),
    document.getElementById('step2'),
    document.getElementById('step3'),
    document.getElementById('step4')
  ];
  const stepIndicators = document.querySelectorAll('.form-stepper .step-indicator');

  let currentStep = 1;

  function setStep(stepNumber) {
    currentStep = stepNumber;

    stepPanels.forEach((panel, idx) => {
      if (idx + 1 === stepNumber) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    stepIndicators.forEach((ind, idx) => {
      const indNum = idx + 1;
      ind.classList.remove('active', 'completed');
      if (indNum === stepNumber) {
        ind.classList.add('active');
      } else if (indNum < stepNumber) {
        ind.classList.add('completed');
      }
    });

    if (stepNumber === 4) {
      populateReviewSummary();
    }
  }

  // Validation functions
  function validateField(inputElement, errorElement) {
    if (!inputElement) return true;
    const parentGroup = inputElement.closest('.form-group');
    const val = inputElement.value.trim();

    if (!val) {
      if (parentGroup) parentGroup.classList.add('has-error');
      return false;
    }

    if (inputElement.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        if (parentGroup) parentGroup.classList.add('has-error');
        return false;
      }
    }

    if (parentGroup) parentGroup.classList.remove('has-error');
    return true;
  }

  function validateStep1() {
    let isValid = true;
    const nameValid = validateField(document.getElementById('studentName'));
    const dobValid = validateField(document.getElementById('studentDob'));
    const genderValid = validateField(document.getElementById('studentGender'));
    const gradeValid = validateField(document.getElementById('studentGrade'));
    const bFormValid = validateField(document.getElementById('studentBForm'));

    if (!nameValid || !dobValid || !genderValid || !gradeValid || !bFormValid) {
      isValid = false;
    }
    return isValid;
  }

  function validateStep2() {
    let isValid = true;
    const fNameValid = validateField(document.getElementById('fatherName'));
    const cnicValid = validateField(document.getElementById('fatherCnic'));
    const phoneValid = validateField(document.getElementById('fatherPhone'));
    const emailValid = validateField(document.getElementById('parentEmail'));
    const addrValid = validateField(document.getElementById('homeAddress'));

    if (!fNameValid || !cnicValid || !phoneValid || !emailValid || !addrValid) {
      isValid = false;
    }
    return isValid;
  }

  function validateStep3() {
    let isValid = true;
    const campusValid = validateField(document.getElementById('preferredCampus'));
    if (!campusValid) isValid = false;
    return isValid;
  }

  // Navigation Button Handlers
  document.getElementById('btnNext1')?.addEventListener('click', () => {
    if (validateStep1()) {
      setStep(2);
    } else {
      showToast('Please fill all required student details correctly.', false);
    }
  });

  document.getElementById('btnPrev2')?.addEventListener('click', () => setStep(1));

  document.getElementById('btnNext2')?.addEventListener('click', () => {
    if (validateStep2()) {
      setStep(3);
    } else {
      showToast('Please fill all required parent/guardian details correctly.', false);
    }
  });

  document.getElementById('btnPrev3')?.addEventListener('click', () => setStep(2));

  document.getElementById('btnNext3')?.addEventListener('click', () => {
    if (validateStep3()) {
      setStep(4);
    } else {
      showToast('Please select your preferred campus branch.', false);
    }
  });

  document.getElementById('btnPrev4')?.addEventListener('click', () => setStep(3));

  // Allow clicking completed stepper icons
  stepIndicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
      const stepTarget = parseInt(indicator.getAttribute('data-step'), 10);
      if (stepTarget < currentStep) {
        setStep(stepTarget);
      }
    });
  });

  // Populate Step 4 Review Card
  function populateReviewSummary() {
    document.getElementById('revStudentName').textContent = document.getElementById('studentName').value || '—';
    document.getElementById('revGrade').textContent = document.getElementById('studentGrade').value || '—';
    document.getElementById('revDob').textContent = document.getElementById('studentDob').value || '—';
    document.getElementById('revGender').textContent = document.getElementById('studentGender').value || '—';
    document.getElementById('revBForm').textContent = document.getElementById('studentBForm').value || '—';
    document.getElementById('revFatherName').textContent = document.getElementById('fatherName').value || '—';
    document.getElementById('revPhone').textContent = document.getElementById('fatherPhone').value || '—';
    document.getElementById('revEmail').textContent = document.getElementById('parentEmail').value || '—';
    document.getElementById('revCampus').textContent = document.getElementById('preferredCampus').value || '—';
    document.getElementById('revConcession').textContent = document.getElementById('concessionCategory').value || 'Standard';
  }

  // Real-time error removal on input
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', () => {
      const parent = input.closest('.form-group');
      if (parent) parent.classList.remove('has-error');
    });
    input.addEventListener('change', () => {
      const parent = input.closest('.form-group');
      if (parent) parent.classList.remove('has-error');
    });
  });

  // Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const termsCheck = document.getElementById('termsCheck');
      const termsError = document.getElementById('termsCheckError');
      if (!termsCheck.checked) {
        termsError.style.display = 'block';
        showToast('Please accept the declaration checkbox before submitting.', false);
        return;
      }
      termsError.style.display = 'none';

      // Generate Unique Application ID
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const generatedAppId = `LSS-2026-${randomDigits}`;
      const now = new Date();
      const dateString = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      // Gather application data
      const newApplication = {
        appId: generatedAppId,
        date: dateString,
        studentName: document.getElementById('studentName').value.trim(),
        studentDob: document.getElementById('studentDob').value,
        studentGender: document.getElementById('studentGender').value,
        studentGrade: document.getElementById('studentGrade').value,
        studentBForm: document.getElementById('studentBForm').value.trim(),
        prevSchool: document.getElementById('prevSchool').value.trim() || 'N/A',
        prevGradeResult: document.getElementById('prevGradeResult').value.trim() || 'N/A',
        fatherName: document.getElementById('fatherName').value.trim(),
        fatherCnic: document.getElementById('fatherCnic').value.trim(),
        fatherPhone: document.getElementById('fatherPhone').value.trim(),
        parentEmail: document.getElementById('parentEmail').value.trim(),
        fatherOccupation: document.getElementById('fatherOccupation').value.trim() || 'N/A',
        motherName: document.getElementById('motherName').value.trim() || 'N/A',
        homeAddress: document.getElementById('homeAddress').value.trim(),
        campus: document.getElementById('preferredCampus').value,
        concession: document.getElementById('concessionCategory').value,
        transport: document.getElementById('transportNeeded').value,
        siblingEnrolled: document.getElementById('siblingEnrolled').value.trim() || 'None',
        medicalConditions: document.getElementById('medicalConditions').value.trim() || 'None',
        status: 'Assessment Scheduled',
        interviewDate: 'Upcoming Saturday, 10:00 AM'
      };

      // Save to localStorage
      saveApplication(newApplication);

      // Open Admission Slip Modal with Generated Details
      displayAdmissionSlip(newApplication);

      showToast(`Congratulations! Application ${generatedAppId} submitted successfully.`, true);

      // Reset form to Step 1 for new inputs
      form.reset();
      setStep(1);
    });
  }

  // ==========================================
  // 7. OFFICIAL ADMISSION SLIP MODAL
  // ==========================================
  const slipModalOverlay = document.getElementById('slipModalOverlay');
  const closeSlipModal = document.getElementById('closeSlipModal');
  const closeSlipBtn = document.getElementById('closeSlipBtn');
  const printSlipBtn = document.getElementById('printSlipBtn');

  function displayAdmissionSlip(app) {
    document.getElementById('slipAppId').textContent = app.appId;
    document.getElementById('slipDate').textContent = `Issued: ${app.date}`;
    document.getElementById('slipStudentName').textContent = app.studentName;
    document.getElementById('slipFatherName').textContent = app.fatherName;
    document.getElementById('slipGrade').textContent = app.studentGrade;
    document.getElementById('slipBForm').textContent = app.studentBForm;
    document.getElementById('slipCampus').textContent = app.campus;
    document.getElementById('slipPhone').textContent = app.fatherPhone;
    document.getElementById('slipConcession').textContent = app.concession;
    document.getElementById('slipTransport').textContent = app.transport;
    document.getElementById('slipBarcodeNum').textContent = `*${app.appId}*`;
    document.getElementById('slipTestDate').textContent = app.interviewDate;
    document.getElementById('slipTestVenue').textContent = `Admission Office, ${app.campus}`;

    slipModalOverlay.classList.add('active');
  }

  if (closeSlipModal) closeSlipModal.addEventListener('click', () => slipModalOverlay.classList.remove('active'));
  if (closeSlipBtn) closeSlipBtn.addEventListener('click', () => slipModalOverlay.classList.remove('active'));

  if (printSlipBtn) {
    printSlipBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ==========================================
  // 8. TRACK APPLICATION STATUS PORTAL
  // ==========================================
  const trackModalOverlay = document.getElementById('trackModalOverlay');
  const openTrackModalBtn = document.getElementById('openTrackModalBtn');
  const footerTrackBtn = document.getElementById('footerTrackBtn');
  const closeTrackModal = document.getElementById('closeTrackModal');
  const btnExecuteTrack = document.getElementById('btnExecuteTrack');
  const trackSearchInput = document.getElementById('trackSearchInput');
  const trackResultBox = document.getElementById('trackResultBox');
  const trackNotFoundNotice = document.getElementById('trackNotFoundNotice');
  const recentApplicationsList = document.getElementById('recentApplicationsList');
  const btnViewSlipFromTrack = document.getElementById('btnViewSlipFromTrack');

  let activeTrackRecord = null;

  function renderRecentApplicationChips() {
    if (!recentApplicationsList) return;
    const records = getStoredApplications();
    recentApplicationsList.innerHTML = '<span style="font-size:0.75rem; color:#64748b; margin-right:8px; display:inline-block;">Recent:</span>';
    
    records.slice(0, 3).forEach(rec => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'recent-app-tag';
      chip.textContent = `${rec.appId} (${rec.studentName})`;
      chip.addEventListener('click', () => {
        trackSearchInput.value = rec.appId;
        executeTrackingSearch(rec.appId);
      });
      recentApplicationsList.appendChild(chip);
    });
  }

  function executeTrackingSearch(query) {
    const q = (query || trackSearchInput.value).trim().toLowerCase();
    if (!q) {
      showToast('Please enter an Application ID or Mobile Number', false);
      return;
    }

    const records = getStoredApplications();
    const found = records.find(r => 
      r.appId.toLowerCase() === q ||
      (r.fatherPhone && r.fatherPhone.replace(/\D/g, '').includes(q.replace(/\D/g, ''))) ||
      r.studentName.toLowerCase().includes(q)
    );

    if (found) {
      activeTrackRecord = found;
      trackNotFoundNotice.style.display = 'none';
      trackResultBox.style.display = 'block';

      document.getElementById('trAppId').textContent = found.appId;
      document.getElementById('trStudentName').textContent = `${found.studentName} — ${found.studentGrade}`;
      document.getElementById('trDateSubmitted').textContent = `Applied on ${found.date}`;
      document.getElementById('trInterviewDate').textContent = `Scheduled at: ${found.campus} (${found.interviewDate})`;
      document.getElementById('trStatusPill').textContent = found.status;
    } else {
      activeTrackRecord = null;
      trackResultBox.style.display = 'none';
      trackNotFoundNotice.style.display = 'block';
    }
  }

  if (openTrackModalBtn) {
    openTrackModalBtn.addEventListener('click', () => {
      renderRecentApplicationChips();
      trackModalOverlay.classList.add('active');
      trackSearchInput.focus();
    });
  }

  if (footerTrackBtn) {
    footerTrackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      renderRecentApplicationChips();
      trackModalOverlay.classList.add('active');
    });
  }

  if (closeTrackModal) {
    closeTrackModal.addEventListener('click', () => {
      trackModalOverlay.classList.remove('active');
    });
  }

  if (btnExecuteTrack) {
    btnExecuteTrack.addEventListener('click', () => executeTrackingSearch());
  }

  if (trackSearchInput) {
    trackSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeTrackingSearch();
      }
    });
  }

  if (btnViewSlipFromTrack) {
    btnViewSlipFromTrack.addEventListener('click', () => {
      if (activeTrackRecord) {
        trackModalOverlay.classList.remove('active');
        displayAdmissionSlip(activeTrackRecord);
      }
    });
  }

  // ==========================================
  // 9. PROSPECTUS MODAL & DOWNLOAD
  // ==========================================
  const prospectusModalOverlay = document.getElementById('prospectusModalOverlay');
  const openProspectusBtn = document.getElementById('openProspectusBtn');
  const footerProspectusBtn = document.getElementById('footerProspectusBtn');
  const closeProspectusModal = document.getElementById('closeProspectusModal');
  const btnDownloadPdfMock = document.getElementById('btnDownloadPdfMock');

  function openProspectus() {
    prospectusModalOverlay.classList.add('active');
  }

  if (openProspectusBtn) openProspectusBtn.addEventListener('click', openProspectus);
  if (footerProspectusBtn) footerProspectusBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openProspectus();
  });

  if (closeProspectusModal) {
    closeProspectusModal.addEventListener('click', () => {
      prospectusModalOverlay.classList.remove('active');
    });
  }

  if (btnDownloadPdfMock) {
    btnDownloadPdfMock.addEventListener('click', () => {
      showToast('Downloading Official Leads School System Prospectus 2026 PDF...', true);
      setTimeout(() => {
        // Trigger simulated browser download
        const blob = new Blob([
          `LEADS SCHOOL SYSTEM - PROSPECTUS 2026-2027\n\n` +
          `Welcome to Leads School System.\n` +
          `Learn • Lead • Succeed\n\n` +
          `Academic Programs:\n` +
          `1. Early Years Montessori (Playgroup, Nursery, Prep)\n` +
          `2. Primary Wing (Grade 1 - 5)\n` +
          `3. Middle Wing (Grade 6 - 8)\n` +
          `4. Cambridge O-Levels & BISE Matriculation\n\n` +
          `Campuses in Lahore, Islamabad, Rawalpindi, Faisalabad.\n` +
          `Admission Helpline: 0800-LEADS (53237)\n` +
          `Website: www.leads.edu.pk`
        ], { type: 'text/plain' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'LEADS_School_System_Prospectus_2026.txt';
        link.click();
        prospectusModalOverlay.classList.remove('active');
      }, 700);
    });
  }

  // Close modals on backdrop click or ESC key
  window.addEventListener('click', (e) => {
    if (e.target === slipModalOverlay) slipModalOverlay.classList.remove('active');
    if (e.target === trackModalOverlay) trackModalOverlay.classList.remove('active');
    if (e.target === prospectusModalOverlay) prospectusModalOverlay.classList.remove('active');
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      slipModalOverlay.classList.remove('active');
      trackModalOverlay.classList.remove('active');
      prospectusModalOverlay.classList.remove('active');
    }
  });

  // ==========================================
  // 10. FAQ ACCORDION
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isAlreadyActive = item.classList.contains('active');

      // Close other items
      faqItems.forEach(otherItem => otherItem.classList.remove('active'));

      if (!isAlreadyActive) {
        item.classList.add('active');
      }
    });
  });

  // ==========================================
  // 11. QUICK CALLBACK FORM
  // ==========================================
  const callbackForm = document.getElementById('quickCallbackForm');
  const callbackSuccessNotice = document.getElementById('callbackSuccessNotice');

  if (callbackForm) {
    callbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const parentName = document.getElementById('quickParentName').value.trim();
      const parentPhone = document.getElementById('quickParentPhone').value.trim();

      if (!parentName || !parentPhone) {
        showToast('Please fill in your name and phone number.', false);
        return;
      }

      callbackSuccessNotice.style.display = 'block';
      showToast(`Thank you ${parentName}! We will call ${parentPhone} shortly.`, true);
      callbackForm.reset();

      setTimeout(() => {
        callbackSuccessNotice.style.display = 'none';
      }, 6000);
    });
  }

});
