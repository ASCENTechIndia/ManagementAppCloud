const DashboardCard = ({
  icon: Icon,
  title,
  subtitle = "",
  value = "",
  onClick,
  iconBg = "bg-blue-500",
}) => {
  return (
    <div
      className={`
        relative overflow-hidden rounded-3xl bg-white p-6 
        h-full w-full 
        shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-xl
        flex flex-col items-center justify-center text-center
        cursor-pointer 
      `}
      //  ${onClick ? 'cursor-pointer' : ''}
      onClick={onClick ? onClick : undefined}
    >
      {/* Decorative blobs – still absolute, but don’t affect centering */}
      <div className="absolute -top-14 -right-14 h-[160px] w-[160px] rounded-full bg-gradient-to-br from-blue-100/40 to-indigo-100/20 pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 h-[120px] w-[120px] rounded-full bg-gradient-to-tr from-purple-100/25 to-pink-100/15 pointer-events-none" />

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        {/* Icon */}
        <div
          className={`mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full ${iconBg} text-white shadow-lg transition-transform duration-300 hover:scale-105`}
        >
          <Icon size={32} />
        </div>

        {/* Title */}
        {/* <h5 className="mb-1 text-sm font-medium text-gray-700 tracking-wide" style={{
          fontSize: "1rem"
        }}>
          {title}
        </h5> */}
        <h5
          className="
    h-12
    flex items-center justify-center
    text-sm font-medium text-gray-700
    leading-5
    text-center
  "
          style={{
            fontSize:"1rem"
          }}
        >
          {title}
        </h5>

        {/* Subtitle (if provided) */}
        {subtitle && (
          <p className="mb-2 text-sm text-gray-500">{subtitle}</p>
        )}

        {/* Value (if provided) */}
        {value && (
          <h4 className="text-2xl font-semibold text-gray-900">{value}</h4>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;