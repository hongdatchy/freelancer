'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

interface FilterProps {
  regions: string[];
}

const START_HOUR = 7;
const END_HOUR = 21;

const generateSlots = () => {
  const slots: string[] = [];
  for (let h = START_HOUR; h < END_HOUR; h++) {
    const start1 = `${String(h).padStart(2, '0')}:00`;
    const end1 = `${String(h).padStart(2, '0')}:30`;
    slots.push(`${start1} - ${end1}`);

    const start2 = `${String(h).padStart(2, '0')}:30`;
    const end2 = `${String(h + 1).padStart(2, '0')}:00`;
    slots.push(`${start2} - ${end2}`);
  }
  return slots;
};

const TIME_SLOTS = generateSlots();

export default function TeacherFilter({ regions }: FilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || '');
  const [selectedGender, setSelectedGender] = useState(searchParams.get('gender') || '');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(searchParams.get('time_slot') || '');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showTimeSlotDropdown, setShowTimeSlotDropdown] = useState(false);

  const genders = ['Male', 'Female', 'Other'];

  const handleRegionChange = (region: string) => {
    const newRegion = selectedRegion === region ? '' : region;
    setSelectedRegion(newRegion);
    setShowRegionDropdown(false);
    updateURL(selectedGender, newRegion, selectedTimeSlot);
  };

  const handleGenderChange = (gender: string) => {
    const newGender = selectedGender === gender ? '' : gender;
    setSelectedGender(newGender);
    setShowGenderDropdown(false);
    updateURL(newGender, selectedRegion, selectedTimeSlot);
  };

  const handleTimeSlotChange = (slot: string) => {
    const newSlot = selectedTimeSlot === slot ? '' : slot;
    setSelectedTimeSlot(newSlot);
    setShowTimeSlotDropdown(false);
    updateURL(selectedGender, selectedRegion, newSlot);
  };

  const updateURL = (gender: string, region: string, time_slot: string) => {
    const params = new URLSearchParams();
    if (gender) params.set('gender', gender);
    if (region) params.set('region', region);
    if (time_slot) params.set('time_slot', time_slot);
    params.set('page', '0');
    params.set('pageSize', '6');

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleResetAll = () => {
    setSelectedRegion('');
    setSelectedGender('');
    setSelectedTimeSlot('');
    router.replace('?page=0&pageSize=6', { scroll: false });
  };

  return (
    <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">

      {/* Region Filter */}
      {/* 
      <div className="relative">
        <button
          onClick={() => setShowRegionDropdown(!showRegionDropdown)}
          className="px-4 py-2 border-2 border-success rounded-lg bg-white text-custom-blue font-semibold flex items-center gap-2 hover:bg-[#f0f0f0] transition-all"
        >
          {selectedRegion || 'Vùng miền'}
          <span className={`transition-transform text-sm ${showRegionDropdown ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {showRegionDropdown && (
          <div className="absolute top-full left-0 mt-2 w-[280px] bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-200">
            <div className="max-h-[350px] overflow-y-auto space-y-2">
              {regions.map((region) => (
                <label key={region} className="flex items-center gap-3 cursor-pointer hover:bg-[#f5f5f5] p-2 rounded transition-all">
                  <input
                    type="checkbox"
                    checked={selectedRegion === region}
                    onChange={() => handleRegionChange(region)}
                    className="w-4 h-4 rounded accent-[#27ba77]"
                  />
                  <span className="text-sm text-gray-700">{region}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
      */}

      {/* Gender Filter */}
      {/* 
      <div className="relative">
        <button
          onClick={() => setShowGenderDropdown(!showGenderDropdown)}
          className="px-4 py-2 border-2 border-success rounded-lg bg-white text-custom-blue font-semibold flex items-center gap-2 hover:bg-[#f0f0f0] transition-all"
        >
          {selectedGender || 'Giới tính'}
          <span className={`transition-transform text-sm ${showGenderDropdown ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {showGenderDropdown && (
          <div className="absolute top-full left-0 mt-2 w-[220px] bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-200">
            <div className="space-y-2">
              {genders.map((gender) => (
                <label key={gender} className="flex items-center gap-3 cursor-pointer hover:bg-[#f5f5f5] p-2 rounded transition-all">
                  <input
                    type="checkbox"
                    checked={selectedGender === gender}
                    onChange={() => handleGenderChange(gender)}
                    className="w-4 h-4 rounded accent-[#27ba77]"
                  />
                  <span className="text-sm text-gray-700">{gender}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
      */}

      {/* Time Slot Filter */}
      <div className="relative">
        <button
          onClick={() => setShowTimeSlotDropdown(!showTimeSlotDropdown)}
          className="px-4 py-2 border-2 border-success rounded-lg bg-white text-custom-blue font-semibold flex items-center gap-2 hover:bg-[#f0f0f0] transition-all"
        >
          {selectedTimeSlot || 'Khung giờ'}
          <span className={`transition-transform text-sm ${showTimeSlotDropdown ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {showTimeSlotDropdown && (
          <div className="absolute top-full left-0 mt-2 w-[200px] bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-200">
            <div className="max-h-[350px] overflow-y-auto space-y-2">
              {TIME_SLOTS.map((slot) => (
                <label key={slot} className="flex items-center gap-3 cursor-pointer hover:bg-[#f5f5f5] p-2 rounded transition-all">
                  <input
                    type="checkbox"
                    checked={selectedTimeSlot === slot}
                    onChange={() => handleTimeSlotChange(slot)}
                    className="w-4 h-4 rounded accent-[#27ba77]"
                  />
                  <span className="text-sm text-gray-700">{slot}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reset All Button */}
      {(selectedRegion || selectedGender || selectedTimeSlot) && (
        <button
          onClick={handleResetAll}
          className="px-4 py-2 text-[#27ba77] font-semibold text-sm hover:underline flex items-center gap-2 transition-all"
        >
          ↻ Reset all
        </button>
      )}
    </div>
  );
}