import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../utils/api.js';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  // Load existing listing if editing
  useEffect(() => {
    const APIListing = async () => {
      if (!params.listingId) return;
      try {
        const res = await API(`/api/listing/get/${params.listingId}`);
        const data = res.data;
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setFormData(data);
      } catch (err) {
        console.log(err);
      }
    };
    APIListing();
  }, [params.listingId]);

  // Upload images to Cloudinary
  const uploadImage = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'mern-estate');

    const res = await API.post(
      'https://api.cloudinary.com/v1_1/dswzycd8q/image/upload',
      data,
      {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      }
    );
    return res.data.secure_url;
  };

  const handleImageSubmit = async () => {
    if (!files.length || files.length + formData.imageUrls.length > 6) {
      setImageUploadError('You can only upload 6 images per listing');
      return;
    }

    setUploading(true);
    setImageUploadError(false);

    try {
      const urls = await Promise.all(Array.from(files).map(uploadImage));
      setFormData((prev) => ({
        ...prev,
        imageUrls: prev.imageUrls.concat(urls),
      }));
    } catch (err) {
      setImageUploadError('Image upload failed (2 mb max per image)');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === 'sale' || id === 'rent') {
      setFormData({ ...formData, type: id });
      return;
    }

    if (id === 'parking' || id === 'furnished' || id === 'offer') {
      setFormData({ ...formData, [id]: checked });
      return;
    }

    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');

      setLoading(true);
      setError(false);

      const res = await API.post(`/api/listing/update/${params.listingId}`, {
        ...formData,
        userRef: currentUser._id,
      });

      const data = res.data;
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* Left side form */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            value={formData.address}
            onChange={handleChange}
          />
          {/* Options */}
          <div className="flex gap-6 flex-wrap">
            {['sale', 'rent', 'parking', 'furnished', 'offer'].map((item) => (
              <div key={item} className="flex gap-2">
                <input
                  type={item === 'sale' || item === 'rent' ? 'checkbox' : 'checkbox'}
                  id={item}
                  checked={
                    item === 'sale'
                      ? formData.type === 'sale'
                      : item === 'rent'
                      ? formData.type === 'rent'
                      : formData[item]
                  }
                  onChange={handleChange}
                  className="w-5"
                />
                <span>{item === 'sale' ? 'Sell' : item === 'rent' ? 'Rent' : item === 'parking' ? 'Parking spot' : item === 'furnished' ? 'Furnished' : 'Offer'}</span>
              </div>
            ))}
          </div>
          {/* Numbers */}
          <div className="flex flex-wrap gap-6">
            {['bedrooms', 'bathrooms', 'regularPrice', 'discountPrice'].map((field) =>
              field !== 'discountPrice' || formData.offer ? (
                <div key={field} className="flex items-center gap-2">
                  <input
                    type="number"
                    id={field}
                    min={field === 'regularPrice' || field === 'discountPrice' ? 0 : 1}
                    max={1000000}
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                    value={formData[field]}
                    onChange={handleChange}
                  />
                  <p>
                    {field === 'bedrooms'
                      ? 'Beds'
                      : field === 'bathrooms'
                      ? 'Baths'
                      : field === 'regularPrice'
                      ? 'Regular price'
                      : 'Discounted price'}
                  </p>
                </div>
              ) : null
            )}
          </div>
        </div>
        {/* Right side images */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            className="p-3 border border-gray-300 rounded w-full"
            onChange={(e) => setFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={handleImageSubmit}
            disabled={uploading}
            className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
          >
            {uploading ? `Uploading ${uploadProgress}%` : 'Upload'}
          </button>
          {formData.imageUrls.map((url, i) => (
            <div key={i} className="flex justify-between p-3 border items-center">
              <img
                src={url}
                alt="listing image"
                className="w-20 h-20 object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(i)}
                className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
              >
                Delete
              </button>
            </div>
          ))}
          <button
            type="submit"
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Updating...' : 'Update Listing'}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
